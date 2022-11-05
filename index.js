// 2. Event loop
import fs from 'fs';

const diff = (path1, path2, cb) => {
    const compare = (data, data2) => {
        const arrayOfLines = data.split('\n')
        const arrayOfLines2 = data2.split('\n')

        const biggestArrayOfLines = arrayOfLines.length > arrayOfLines2.length
            ? arrayOfLines : arrayOfLines2;
        const res = biggestArrayOfLines.reduce((acc, value, index) => {
            if (arrayOfLines[index] === arrayOfLines2[index]) return acc

            return [...acc, [arrayOfLines[index], arrayOfLines2[index]].map((val) => val === undefined ? null : val)]
        }, [])
        return res;
    }

    fs.readFile(path1, 'utf-8', (err, data,) => {
        if (err) {
            cb(err);
            return
        }
        fs.readFile(path2, 'utf-8', (err2, data2) => {
            if (err2) {
                cb(err);
                return
            }
            const result = compare(data, data2);
            cb(null, result);
        })
    })
}

const callback = (err, data) => {
    console.log(data)
}

//diff('__fixtures__/file1', '__fixtures__/file2', callback)


// 3. Таймеры
const asyncFilter = (coll, fn, cb) => {
    if (coll.length === 0) {
        cb(coll.slice());
        return;
    }
    const iter = ([thirstElement, ...rest], acc) => {
        const newAcc = fn(thirstElement) ? [...acc, thirstElement] : [...acc];
        if (rest.length === 0) {
            cb(newAcc);
            return;
        }
        setTimeout(iter, 0, rest, newAcc)
    }
    return  iter(coll, []);
}

// const coll = [1, 2, '1', '' , 'str'];
// asyncFilter(coll, (v) => v === '1', (result) => {
//     console.log(result);
// });

// 4. Callback hell
const waterfall = (functions, callback) => {
    if (functions.length === 0) return callback();
    const next = ([head, ...rest], acc) => {
        const cb = (err, ...args) => {
            if(err) return callback(err, args);
            if(rest.length === 0) return callback(err, args);
            else next(rest, args);
        }
        head(...acc, cb);
    }
    next(functions, [])
}

const arrayOfFunctions = [
    cb => cb(null),
    cb => cb(null, 'result1'),
    (res1, cb) => cb(null, res1, 'result2'),
    (res1, res2, cb) => cb(null, res1, res2)
]

// waterfall(arrayOfFunctions, (err, res) => console.log(res))


// retry.js
const retry = (count, fn, callback) => {
    const cbHandler = (err, result) => {
        if (!err || count <= 1) {
            callback(err, result)
            return
        }
        retry(count - 1, fn, callback)
    }
    fn(cbHandler)
}

//imperativeStyleRetry
const imperativeStyleRetry = (count, fn, callback) => {
    const callbackWrapper = (err, res) => {
        if (!err || count <= 1) {
            callback(err, res);
            return;
        }
        imperativeStyleRetry(count - 1, fn, callback)
    }
    fn(callbackWrapper)
}

let calledTimes = 0;
imperativeStyleRetry(3, (cb) => cb(++calledTimes), (err, res) => console.log(err, res));
// imperativeStyleRetry(
//     3,
//     cb => calledTimes < 3 ? cb(++calledTimes) : cb(null, calledTimes),
//     (err, result) => {
//         console.log(calledTimes) // 3
//         console.log(err); // Null
//         console.log(result); // 3
//     }
// )

// jest
export const reverse = str => str.split('').reverse().join('');