def fibonacci(n):
    """Generate a Fibonacci sequence up to the nth number."""
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

# Example usage
if __name__ == "__main__":
    n = 5
    print("Fibonacci sequence:", fibonacci(n))