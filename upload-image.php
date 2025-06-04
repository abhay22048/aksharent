<?php



// Rest of the file's code...
// upload-image.php
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Check if image file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'error' => 'No image uploaded or upload error']);
    exit;
}

// Create images directory if it doesn't exist
$targetDir = './images/';
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0755, true);
}

// Generate a unique filename to prevent overwrites
$originalFilename = basename($_FILES['image']['name']);
$extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
$uniqueFilename = uniqid() . '_' . time() . '.' . $extension;
$targetFile = $targetDir . $uniqueFilename;

// Only allow certain file formats
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
if (!in_array(strtolower($extension), $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Only JPG, JPEG, PNG, GIF, and WEBP files are allowed']);
    exit;
}

// Check file size (limit to 5MB)
if ($_FILES['image']['size'] > 5242880) { // 5MB in bytes
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'File is too large. Maximum size is 5MB']);
    exit;
}

// Try to save the uploaded image
if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    // Return success with the filename
    echo json_encode([
        'success' => true, 
        'filename' => $uniqueFilename,
        'filepath' => $targetFile
    ]);
} else {
    // Error
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'Failed to save image']);
}
?>