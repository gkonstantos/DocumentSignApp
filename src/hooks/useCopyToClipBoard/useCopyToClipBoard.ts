import copy from "copy-to-clipboard";

/**
 * Exposed Api of useCopyToClipboard Hook.
 */
 type UseCopyToClipboardApi = {
    /**
     * @description callBack to delete current cookie value.
     * @param {string} text
     * @returns {boolean} If true value was copied to clipboard. Otherwise error.
     */
    copy: (text: string) => boolean;
}
/**
 * @description React hook that provides Clipboard related functionality.
 * @returns {UseCopyToClipboardApi}
 */
export const useCopyToClipBoard = (): UseCopyToClipboardApi => {
    return {
        copy: (text: string) => copy(text)
    };
}

export default useCopyToClipBoard;