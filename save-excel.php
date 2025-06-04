<?php


// Rest of the file's code...
// save-excel.php
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit;
}

// Define where to save the file
$targetDir = './'; // Save in the same directory as this script
$targetFile = $targetDir . 'products.xlsx'; // Always save as products.xlsx

// Try to save the uploaded file
if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
    // Success
    echo json_encode(['success' => true, 'message' => 'File saved successfully']);
} else {
    // Error
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Failed to save file']);
}
?>