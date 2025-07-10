#!/bin/bash

# Script to find entry files in src directory and output as JSON array
# Finds:
# - index.ts/tsx files in first depth of components, helpers, constants, types directories
# - route.ts files anywhere in src

set -euo pipefail

# Configuration
readonly TARGET_DIRECTORIES=("components" "helpers" "constants" "types" "examples")

# Display usage information
usage() {
    echo "Usage: $(basename "$0") [DIRECTORY]"
    echo ""
    echo "Find entry files in src directory and output as JSON array."
    echo ""
    echo "Arguments:"
    echo "    DIRECTORY    Project directory to search (default: current directory)"
    echo ""
    echo "Examples:"
    echo "    $(basename "$0")                    # Search in ./src"
    echo "    $(basename "$0") /path/to/project   # Search in /path/to/project/src"
}

# Check if file is a valid first-depth index file
is_valid_index_file() {
    local file_path="$1"
    
    for dir in "${TARGET_DIRECTORIES[@]}"; do
        if [[ "$file_path" =~ /$dir/index\.(ts|tsx)$ ]]; then
            # Extract everything after "/$dir/"
            local after_dir="${file_path##*/"$dir"/}"
            
            # Check if it's exactly "index.ts" or "index.tsx" (first depth)
            if [[ "$after_dir" == "index.ts" || "$after_dir" == "index.tsx" ]]; then
                return 0  # Valid
            fi
        fi
    done
    
    return 1  # Invalid
}

# Check if file is a route file
is_route_file() {
    local file_path="$1"
    [[ "$file_path" =~ route\.ts$ ]]
}

# Find and format entry files as JSON array
find_entry_files() {
    local search_dir="$1"
    local src_dir="$search_dir/src"
    
    echo "["
    
    local first_entry=true
    
    # Find all potential entry files and process them
    while IFS= read -r -d '' file; do
        # Get relative path from search directory
        local relative_path="${file#"$search_dir"/}"
        relative_path="${relative_path#./}"  # Remove leading "./" if present
        
        # Check if file is valid entry point
        if is_valid_index_file "$relative_path" || is_route_file "$relative_path"; then
            # Add comma separator if not first entry
            if [[ "$first_entry" == "false" ]]; then
                echo ","
            fi
            
            # Output JSON string with proper indentation
            echo -n "    \"$relative_path\""
            first_entry=false
        fi
        
    done < <(find "$src_dir" -type f \( -name "route.ts" -o -name "index.ts" -o -name "index.tsx" \) -print0 2>/dev/null | sort -z)
    
    echo ""
    echo "]"
}

# Validate project directory
validate_directory() {
    local directory="$1"
    
    if [[ ! -d "$directory" ]]; then
        echo "Error: Directory '$directory' does not exist" >&2
        exit 1
    fi
    
    if [[ ! -d "$directory/src" ]]; then
        echo "Error: 'src' directory not found in '$directory'" >&2
        exit 1
    fi
}

# Main execution function
main() {
    # Parse arguments
    if [[ $# -gt 1 ]]; then
        usage >&2
        exit 1
    fi
    
    if [[ $# -eq 1 && ("$1" == "-h" || "$1" == "--help") ]]; then
        usage
        exit 0
    fi
    
    local project_dir="${1:-.}"  # Use current directory if no argument provided
    
    # Validate and process
    validate_directory "$project_dir"
    find_entry_files "$project_dir"
}

# Run the script
main "$@"