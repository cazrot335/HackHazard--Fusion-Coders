def bubble_sort(arr):
    """
    Sorts an array using the bubble sort algorithm.

    Args:
        arr (list): The array to sort.

    Returns:
        list: The sorted array.
    """
    n = len(arr)

    for i in range(n):
        # Create a flag that will allow the function to terminate early if there's nothing left to sort
        swapped = False

        # Start looking at each item of the list one by one, comparing it with its adjacent value
        for j in range(0, n - i - 1):
            # If we find an element that is greater than its adjacent element
            if arr[j] > arr[j + 1]:
                # Swap them
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                # Set the flag to True so we'll loop again after this iteration
                swapped = True

        # If no two elements were swapped in inner loop, the list is sorted
        if not swapped:
            break

    return arr


# Example usage
if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", arr)
    sorted_arr = bubble_sort(arr)
    print("Sorted array:", sorted_arr)
