document.addEventListener('DOMContentLoaded', () => {
    const algorithmSelect = document.getElementById('algorithm');
    const startBtn = document.getElementById('startBtn');
    const arrayInput = document.getElementById('arrayInput');
    const arrayContainer = document.getElementById('arrayContainer');
    const arrayValues = document.getElementById('arrayValues');
    const timeComplexityElem = document.getElementById('timeComplexity');
    const spaceComplexityElem = document.getElementById('spaceComplexity');
    const timeTakenElem = document.getElementById('timeTaken');

    function updateArrayDisplay(array) {
        arrayValues.textContent = array.join(', ');
    }

    function updateArrayContainerHeight() {
        // Get all bars
        const bars = document.querySelectorAll('.bar');
        if (bars.length === 0) return;
        
        // Calculate maximum bar height
        const maxBarHeight = Math.max(...Array.from(bars).map(bar => bar.offsetHeight));
        
        // Set the container height based on the tallest bar
        arrayContainer.style.height = `${maxBarHeight + 20}px`; // Adding 20px for padding/margin
    }

    function createBars(array) {
        arrayContainer.innerHTML = ''; // Clear previous bars
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value}px`;
            arrayContainer.appendChild(bar);
        });
        updateArrayContainerHeight();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function sortArray(array, algorithm) {
        const startTime = performance.now();

        switch (algorithm) {
            case 'bubble':
                await bubbleSort(array);
                break;
            case 'insertion':
                await insertionSort(array);
                break;
            case 'selection':
                await selectionSort(array);
                break;
            case 'merge':
                await mergeSort(array, 0, array.length - 1);
                break;
            case 'quick':
                await quickSort(array, 0, array.length - 1);
                break;
        }

        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        timeTakenElem.textContent = `${timeTaken.toFixed(2)} ms`;

        updateArrayDisplay(array);
    }

    async function bubbleSort(array) {
        const length = array.length;
        for (let i = 0; i < length - 1; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    createBars(array);
                    await sleep(50);
                }
            }
        }
    }

    async function insertionSort(array) {
        const length = array.length;
        for (let i = 1; i < length; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
                createBars(array);
                await sleep(50);
            }
            array[j + 1] = key;
            createBars(array);
            await sleep(50);
        }
    }

    async function selectionSort(array) {
        const length = array.length;
        for (let i = 0; i < length - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < length; j++) {
                if (array[j] < array[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                createBars(array);
                await sleep(50);
            }
        }
    }

    async function mergeSort(array, left, right) {
        if (left < right) {
            const middle = Math.floor((left + right) / 2);
            await mergeSort(array, left, middle);
            await mergeSort(array, middle + 1, right);
            await merge(array, left, middle, right);
        }
    }

    async function merge(array, left, middle, right) {
        const leftArray = array.slice(left, middle + 1);
        const rightArray = array.slice(middle + 1, right + 1);

        let i = 0, j = 0, k = left;
        while (i < leftArray.length && j < rightArray.length) {
            if (leftArray[i] <= rightArray[j]) {
                array[k++] = leftArray[i++];
            } else {
                array[k++] = rightArray[j++];
            }
            createBars(array);
            await sleep(50);
        }

        while (i < leftArray.length) {
            array[k++] = leftArray[i++];
            createBars(array);
            await sleep(50);
        }

        while (j < rightArray.length) {
            array[k++] = rightArray[j++];
            createBars(array);
            await sleep(50);
        }
    }

    async function quickSort(array, low, high) {
        if (low < high) {
            const pi = await partition(array, low, high);
            await quickSort(array, low, pi - 1);
            await quickSort(array, pi + 1, high);
        }
    }

    async function partition(array, low, high) {
        const pivot = array[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                createBars(array);
                await sleep(50);
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        createBars(array);
        await sleep(50);
        return i + 1;
    }

    startBtn.addEventListener('click', () => {
        const algorithm = algorithmSelect.value;
        const inputArray = arrayInput.value.split(',').map(Number).filter(n => !isNaN(n));
        updateArrayDisplay(inputArray);
        createBars(inputArray);

        // Update complexity info based on selected algorithm
        switch (algorithm) {
            case 'bubble':
                timeComplexityElem.textContent = 'O(n^2)';
                spaceComplexityElem.textContent = 'O(1)';
                break;
            case 'insertion':
                timeComplexityElem.textContent = 'O(n^2)';
                spaceComplexityElem.textContent = 'O(1)';
                break;
            case 'selection':
                timeComplexityElem.textContent = 'O(n^2)';
                spaceComplexityElem.textContent = 'O(1)';
                break;
            case 'merge':
                timeComplexityElem.textContent = 'O(n log n)';
                spaceComplexityElem.textContent = 'O(n)';
                break;
            case 'quick':
                timeComplexityElem.textContent = 'O(n log n) average, O(n^2) worst';
                spaceComplexityElem.textContent = 'O(log n)';
                break;
        }

        sortArray(inputArray, algorithm);
    });
});
