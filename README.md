# AI-FileManager

A simple file manager integrated with AI services for file summary

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Features

- local file storage

  - From:
    - local directory
    - network drive
    - cloud storage

- File Summary

  - with AI
  - Integration with Azure AI services

- File Search

  - Full text search

- File Details
  - File name
  - File type
  - File size
  - Date modified

## Installation

#### 1. Make sure you have node version 21 installed

#### 2. Clone the repository

```bash
git clone https://github.com/geo-afk/AI-FileManager
```

#### 3. Install dependencies

```bash
npm install
```

#### 4. Set up Azure AI services

    - Create a new Azure AI services resource
    - Get the endpoint and key
    - Set the endpoint and key in the .env file
    - Load the Azure AI services key from your .env file into program

#### 5. Run the application

#### Development

```bash
npm run dev

```

#### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Usage

#### 1. Select your file storage

    - From local directory
    - From network drive
    - From cloud storage

#### 2. Browse your files

    - You can browse your files and see the file details on the right side of the screen when file is selected

#### 3. Select the file you want to summarize

        - will get a popup asking you to confirm
        - select 'Yes' to continue
        - Select 'No' to cancel

## License

[Licence](LICENSE)
