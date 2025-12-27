#!/bin/bash

URL="http://127.0.0.1:3000/user"
COUNT=1000  # Reduced for better measurement
CONCURRENT=50  # Number of concurrent requests

echo "Performance testing $URL with $COUNT requests ($CONCURRENT concurrent)..."

# Create temporary files for storing results
TEMP_DIR=$(mktemp -d)
RESULTS_FILE="$TEMP_DIR/results.txt"
TIMES_FILE="$TEMP_DIR/times.txt"

# Start time
START_TIME=$(date +%s.%N)

# Function to make request and measure time
make_request() {
    local request_id=$1
    local start=$(date +%s.%N)
    
    response=$(curl -s -o /dev/null -w "%{http_code},%{time_total},%{time_connect},%{time_starttransfer}" "$URL")
    
    local end=$(date +%s.%N)
    local duration=$(echo "$end - $start" | bc -l)
    
    echo "$request_id,$response,$duration" >> "$RESULTS_FILE"
    echo "$duration" >> "$TIMES_FILE"
}

# Export function so it can be used with xargs
export -f make_request
export URL RESULTS_FILE TIMES_FILE

# Run requests in batches to control concurrency
echo "Starting load test..."
seq 1 $COUNT | xargs -n 1 -P $CONCURRENT -I {} bash -c 'make_request {}'

# End time
END_TIME=$(date +%s.%N)
TOTAL_TIME=$(echo "$END_TIME - $START_TIME" | bc -l)

# Calculate statistics
echo ""
echo "=== PERFORMANCE RESULTS ==="
echo "Total requests: $COUNT"
echo "Total time: ${TOTAL_TIME}s"
echo "Requests per second: $(echo "scale=2; $COUNT / $TOTAL_TIME" | bc -l)"
echo ""

# Analyze response codes
echo "=== RESPONSE CODES ==="
awk -F',' '{print $2}' "$RESULTS_FILE" | sort | uniq -c | while read count code; do
    echo "HTTP $code: $count requests"
done
echo ""

# Calculate response time statistics
echo "=== RESPONSE TIME STATISTICS ==="
sort -n "$TIMES_FILE" > "$TEMP_DIR/sorted_times.txt"

TOTAL_REQUESTS=$(wc -l < "$TIMES_FILE")
MIN_TIME=$(head -n 1 "$TEMP_DIR/sorted_times.txt")
MAX_TIME=$(tail -n 1 "$TEMP_DIR/sorted_times.txt")
AVG_TIME=$(awk '{sum+=$1} END {print sum/NR}' "$TIMES_FILE")

# Calculate percentiles
P50_LINE=$(echo "($TOTAL_REQUESTS * 50 + 50) / 100" | bc)
P95_LINE=$(echo "($TOTAL_REQUESTS * 95 + 50) / 100" | bc)
P99_LINE=$(echo "($TOTAL_REQUESTS * 99 + 50) / 100" | bc)

P50_TIME=$(sed -n "${P50_LINE}p" "$TEMP_DIR/sorted_times.txt")
P95_TIME=$(sed -n "${P95_LINE}p" "$TEMP_DIR/sorted_times.txt")
P99_TIME=$(sed -n "${P99_LINE}p" "$TEMP_DIR/sorted_times.txt")

printf "Min response time: %.4fs\n" "$MIN_TIME"
printf "Max response time: %.4fs\n" "$MAX_TIME"
printf "Avg response time: %.4fs\n" "$AVG_TIME"
printf "P50 response time: %.4fs\n" "$P50_TIME"
printf "P95 response time: %.4fs\n" "$P95_TIME"
printf "P99 response time: %.4fs\n" "$P99_TIME"

echo ""
echo "=== CURL TIMING BREAKDOWN (from last request) ==="
tail -n 1 "$RESULTS_FILE" | awk -F',' '{
    printf "Connection time: %.4fs\n", $4
    printf "Time to first byte: %.4fs\n", $5
    printf "Total time: %.4fs\n", $3
}'

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "Performance test completed!"