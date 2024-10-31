const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Get elements from the HTML
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var btnUpdate = document.getElementById('btnUpdate');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');
var fileList = document.getElementById('fileList');

// Define the path to save files
let pathName = path.join(__dirname, 'Files');

// Function to refresh the list of files displayed in the UI
function refreshFileList() {
    fs.readdir(pathName, (err, files) => {
        if (err) {
            console.error("Could not list files:", err);
            return;
        }

        // Clear current file list in UI before repopulating
        fileList.innerHTML = '';
        
        files.forEach(file => {
            // Create a paragraph element for each file
            let fileElement = document.createElement('p');
            fileElement.textContent = file;
            
            // Add click event to populate file name when selected
            fileElement.addEventListener('click', () => {
                fileName.value = file;
                fileContents.value = ''; // Clear contents initially on file selection
            });
            fileList.appendChild(fileElement);
        });
    });
}

// Function to create a new note
btnCreate.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value);
    let contents = fileContents.value;

    // Write contents to the specified file
    fs.writeFile(file, contents, function(err) {
        if (err) {
            return console.log(err);
        }
        alert(fileName.value + " file was created");
        refreshFileList(); // Update file list to show new file
    });
});

// Function to read a selected note's contents
btnRead.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value);

    // Read the file's content and display it in the text area
    fs.readFile(file, function(err, data) {
        if (err) {
            return console.log(err);
        }
        fileContents.value = data; // Populate text area with file contents
    });
});

// Function to delete a selected note after user confirmation
btnDelete.addEventListener('click', function() {
    const confirmation = confirm("Are you sure you want to delete this note?"); // Prompt for confirmation
    
    if (confirmation) { // If confirmed, proceed with deletion
        let file = path.join(pathName, fileName.value);
        
        fs.unlink(file, function(err) {
            if (err) {
                return console.log(err);
            }
            fileName.value = "";
            fileContents.value = "";
            alert(fileName.value + " file was deleted");
            refreshFileList(); // Update list to reflect deletion
        });
    } else {
        alert("Deletion canceled."); // Cancel message if user chooses not to delete
    }
});

// Function to update a selected note's contents
btnUpdate.addEventListener('click', function() {
    let file = path.join(pathName, fileName.value);
    let contents = fileContents.value;

    // Write the updated content to the file
    fs.writeFile(file, contents, function(err) {
        if (err) {
            return console.log(err);
        }
        alert(fileName.value + " file was updated");
        refreshFileList(); // Refresh list to confirm update
    });
});

// Initial load of file list when the app starts
refreshFileList();
