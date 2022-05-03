import { useEffect } from "react";

/**
 * Hook that call action() outside of the passed ref
 */
const useOutsideAlerter = (ref, action) => {
  useEffect(() => {
    /**
     * on outside of element
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        action();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export default useOutsideAlerter;
