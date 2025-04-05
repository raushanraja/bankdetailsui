#!/bin/bash

# Script to add testing support to a TypeScript/JavaScript project using pnpm

# Set default values and constants
TEST_FRAMEWORK="jest" # Default testing framework (can be jest, mocha, etc.)
TS_NODE_DEV_PACKAGE="ts-node-dev"
TEST_SCRIPT="test"
TEST_COMMAND="jest --watchAll" # Default test command

# --- Helper Functions ---

# Function to check if a command exists
command_exists() {
	command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies using pnpm
install_dependencies() {
	echo "Installing dependencies using pnpm..."
	pnpm add --save-dev "$@"
	if [ $? -ne 0 ]; then
		echo "Error installing dependencies with pnpm. Aborting."
		exit 1
	fi
}

# Function to add a script to package.json
add_script_to_package_json() {
	local script_name="$1"
	local script_command="$2"
	echo "Adding script '$script_name' to package.json..."
	jq ".scripts.\"$script_name\" = \"$script_command\"" package.json >temp.json && mv temp.json package.json
	if [ $? -ne 0 ]; then
		echo "Error adding script to package.json.  You may need to edit it manually."
	fi
}

# Function to initialize Jest (if Jest is selected)
initialize_jest() {
	echo "Initializing Jest... select the required options."
	pnpm dlx jest --init
}

# Function to create a basic test file
create_basic_test_file() {
	local filename="$1"
	local content="$2"
	echo "Creating basic test file: $filename"
	cat >"$filename" <<EOL
$content
EOL
}

# --- Main Script ---

# 1. Check for package.json
if [ ! -f "package.json" ]; then
	echo "Error: package.json not found. Please run this script in a JavaScript/TypeScript project directory."
	exit 1
fi

# 1.1 Check for pnpm
if ! command_exists pnpm; then
	echo "Error: pnpm is not installed. Please install it before running this script."
	exit 1
fi

# 2. Get user input (optional - if you want to make it more interactive)
# Commented out for simplicity - defaults are used
# read -p "Enter the testing framework (jest, mocha, etc.): [jest] " TEST_FRAMEWORK
# TEST_FRAMEWORK=${TEST_FRAMEWORK:-jest}  # Default to jest if empty

# 3. Install dependencies based on selected framework
case "$TEST_FRAMEWORK" in
"jest")
	install_dependencies jest @types/jest ts-jest ts-node
	;;
"mocha")
	install_dependencies mocha chai @types/mocha @types/chai ts-node
	TEST_COMMAND="mocha --require ts-node/register 'test/**/*.ts'" #Adjust path as needed
	;;
*)
	echo "Error: Unsupported testing framework: $TEST_FRAMEWORK"
	exit 1
	;;
esac

# Install ts-node-dev, so that if you run the test file directly, the changes can be reflected immediately.
install_dependencies "$TS_NODE_DEV_PACKAGE"

# 4. Configure TypeScript (if needed - tsconfig.json exists)
if [ -f "tsconfig.json" ]; then
	echo "tsconfig.json found.  Making sure 'moduleResolution' is 'node' (recommended)."
	jq '.compilerOptions.moduleResolution = "node"' tsconfig.json >temp.json && mv temp.json tsconfig.json
	echo "Making sure 'esModuleInterop' is true."
	jq '.compilerOptions.esModuleInterop = true' tsconfig.json >temp.json && mv temp.json tsconfig.json

	# Check if "src" directory exists and create if it doesn't
	if [ ! -d "src" ]; then
		mkdir src
		echo "Created src directory."
	fi
else
	echo "tsconfig.json not found.  You should create one (pnpm exec tsc --init)."
fi

# 5.  Framework-specific setup
case "$TEST_FRAMEWORK" in
"jest")
	if [ ! -f "jest.config.js" ]; then
		initialize_jest
	fi
	;;
"mocha")
	# Optional:  Add a .mocharc.js or .mocharc.json file if you want specific Mocha configurations.
	# Example (requires installing the mocha CLI globally or locally as a dev dependency):
	# mocha --init
	;;
esac

# 6. Add test script to package.json
add_script_to_package_json "$TEST_SCRIPT" "$TEST_COMMAND"

# 7. Create a basic test file (as an example)

TEST_FILENAME="test/index.test.ts"

if [ ! -d "test" ]; then
	mkdir test
	echo "Created test directory."
fi

if [ ! -f "$TEST_FILENAME" ]; then
	case "$TEST_FRAMEWORK" in
	"jest")
		TEST_CONTENT="
describe('My Test Suite', () => {
  it('should pass this test', () => {
    expect(true).toBe(true);
  });
});
"
		;;
	"mocha")
		TEST_CONTENT="
import { expect } from 'chai';

describe('My Test Suite', () => {
  it('should pass this test', () => {
    expect(true).to.be.true;
  });
});
"
		;;
	esac
	create_basic_test_file "$TEST_FILENAME" "$TEST_CONTENT"
fi

# 8.  Print instructions to the user
echo ""
echo "Testing support added successfully!"
echo ""
echo "Next steps:"
echo "1.  Write your tests in the 'test' directory."
echo "2.  Run tests using: pnpm run $TEST_SCRIPT"
echo "3.  Review and customize the test command and configuration (jest.config.js, mocha.opts, etc.) as needed."
echo ""
echo "Have fun testing!"

exit 0
