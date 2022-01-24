function shuffle(arr) {
    let index = arr.length;
    let random = 0;

    while (index > 0) {
        random = Math.floor(Math.random() * index--);
        let temp = arr[index];
        arr[index] = arr[random];
        arr[random] = temp;
    }

    return arr;
}

module.exports = shuffle;