# traverse-md

`traverse-md` is a simple command-line tool that generates a markdown-compatible directory structure of a given folder and writes it to a README file. It’s perfect for documenting project structures or creating navigable outlines in `README.md` files.

## Features

- Outputs the directory and file structure in a markdown tree format
- Automatically writes to `README.md` or updates the existing structure within the file
- Customizable root directory path

## Installation

You can use `traverse-md` directly with `npx`, or install it globally.

### Using npx

```bash
npx traverse-md "path/to/directory"
```

### Global Installation

Install `traverse-md` globally to use it without `npx`:

```bash
npm install -g traverse-md
```

## Usage

### Basic Command

To generate the structure of the current working directory, run:

```bash
npx traverse-md .
```

Or, if installed globally:

```bash
traverse-md .
```

This will create or update a `README.md` file in the specified directory with a structured outline of your project.

### Specifying a Directory

Provide a specific path if you want to outline a different directory:

```bash
npx traverse-md path/to/your-directory
```

### Example Output

Running `traverse-md` in a Next.js project might produce the following output in your `README.md`:

```markdown
my-nextjs-app/
├── public/              # Static files (images, fonts, etc.)
│   └── favicon.ico
├── src/                 # Source folder
│   ├── app/             # App directory for Next.js 13+ App Router
│   │   ├── api/         # API routes
│   │   └── layout.tsx   # Global layout for the app
│   └── components/      # Reusable components
│       ├── Button.tsx
│       └── Header.tsx
│   └── hooks/           # Custom React hooks
│       └── useAuth.ts
├── .env                 # Environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Package dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

### Customization

- **File Path**: Run the command with `npx traverse-md "path/to/directory"` to specify which directory to structure.
- **Updating the README**: If `README.md` exists, `traverse-md` will update the section containing the folder structure instead of appending a duplicate.

## Configuration Options

`traverse-md` can be extended with future updates. The current implementation writes the folder structure in the `README.md` file automatically, ensuring a neat, collapsible section. Custom configurations can be added by modifying the codebase to accept parameters for output format or additional information (e.g., file sizes).

## Contributing

I welcome contributions to enhance `traverse-md`! Here are ways to get involved:

1. **Report issues**: If you find bugs, report them on the GitHub issues page.
2. **Submit PRs**: Fork the repository and submit pull requests for improvements.
3. **Feature requests**: Let us know what features you'd like to see in future versions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
