import { Category, CategorySequencer } from '@/use/localApi';

/**
 * Simple lexical sequencer
 */
class LexicalSequencer implements CategorySequencer {

    getSequence(categories: Array<Category>): Array<Category> {
        const copy = categories.slice();
        copy.sort((a, b) => a.name.localeCompare(b.name));
        return copy;
    }

}

/**
 * Starts with the latest stored sequence; sequence can be changed explicitly.
 */
class MemorizingSequencer implements CategorySequencer {

    private lastSequence: Array<string> = [];
    private readonly storeName: string;

    // store the sequence information in
    constructor(storageName: string) {
        this.storeName = storageName + ".categories";
        const data = localStorage.getItem(this.storeName);
        try {
            if (data) {
                const result = JSON.parse(data);
                if (Array.isArray(result)) {
                    this.lastSequence = result;
                }
            }
        } catch (error) {
            console.warn("Unable to read category information from localstorage. Using arbitrary sequence");
        }
    }

    /**
     * Sort the items to match the stored category sequence.
     * Unmatched categories are put last, and then registered.
     * @param categories the list of known categories
     */
    getSequence(categories: Array<Category>): Array<Category> {
        let copy = categories.slice();
        const result: Array<Category> = [];
        // Note to myself:
        // for ... in  ... => iterate over keys. for ... of ... => iterate over values
        for (const catName of this.lastSequence) {
            const category = copy.find(cat => cat.name === catName);
            if (category) {
                result.push(category)
            }
            copy = copy.filter(cat => !(cat.name === catName));
        }
        // append remaining categories
        result.push(...copy);   // note to myself: javascript spread operator
        this.lastSequence = result.map(cat => cat.name);
        this.storeLocal();
        return result;
    }

    private storeLocal() {
        localStorage.setItem(this.storeName, JSON.stringify(this.lastSequence));
    }

    /**
     * Move the index of the matching category by the given amount (positive numbers => appear later in the list)
     * @param categoryName the name of the category whose sorting index should be shifted 
     * @param by the relative amount by which to move the category, typically +1 or -1
     */
    moveCategory(categoryName: string, by: number) {
        const currentIndex = this.lastSequence.indexOf(categoryName);
        if (currentIndex < 0) { // cannot move element which does not yet exist
            return;
        }
        const newIndex = currentIndex + by;
        if (newIndex < 0 || newIndex >= this.lastSequence.length) { // cannot move element outside boundaries
            return;
        }
        const copyWithout = this.lastSequence.slice(0, currentIndex).concat(this.lastSequence.slice(currentIndex + 1));
        const result = copyWithout.slice(0, newIndex);
        result.push(categoryName);
        result.push(... copyWithout.slice(newIndex));
        this.lastSequence = result;
        this.storeLocal();
    }

}

export { LexicalSequencer, MemorizingSequencer };
