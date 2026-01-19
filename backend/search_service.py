from googlesearch import search

def search_web(query: str, num_results: int = 3) -> str:
    """
    Searches Google and returns a summary string of top URLs.
    """
    try:
        results = []
        # basic search yielding URLs
        for url in search(query, stop=num_results, pause=2):
            results.append(url)
        
        if not results:
            return "No search results found."
        
        return "Top Search Results:\n" + "\n".join(results)
    except Exception as e:
        print(f"Search error: {e}")
        return "Search unavailable."
