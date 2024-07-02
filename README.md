# Chrome Extension - Website Blocker

This Chrome extension allows you to block specific websites based on a predefined blocklist.

## Installation and Usage

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Steps

1. **Install Node Modules**: Navigate to your project directory and run:
   ```sh
   npm install
   ```

2. **Build the Project**: Create a production build of your extension by running:
   ```sh
   npm run build
   ```
   This will generate a `build` folder in your project directory.

3. **Load the Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable **Developer mode** by toggling the switch in the top right corner.
   - Click on **Load unpacked**.
   - Navigate to your project directory and select the `build` folder.
   - The extension will now appear in the list of installed extensions.

## Usage Instructions

1. Open the extension from the Chrome toolbar.
2. Enter the complete URL of the website you want to block (e.g., `https://www.w3schools.com/`).
3. Once added, the extension will prevent access to the blocked website.

## Features
- Block specific websites by entering their URLs.
- Easy to use interface to manage blocked websites.

## Contributing
Contributions are welcome! Please fork this repository and submit pull requests for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize any part of this README to better fit your project's needs.
