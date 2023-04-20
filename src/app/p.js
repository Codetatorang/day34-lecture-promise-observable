//how to create a promise
let p = new Promise(
    (resolve, reject) => {
        //perform operation here 
        setTimeout(
            () => {
                console.info('>> simulating SQl operation')
                resolve('sucess!')
                reject('Error!')//will stop once resolved
            },
            2000 // 2 sec
        )
    }
)

p.then(//anything returned in a then will be a promise (like java optional)
    v => {
        console.info(`promise resolved: ${v}`)
        throw "ERROR!"
        // return v.toUpperCase()
    }
).then(v => { //.then is a functional way of sequencing in js
    console.info(`second then:${v}`)
}
).then(v => {
    console.info(`third then:${v}`)
}).catch(err => {
    console.error(`Error: ${err}`)
    return "recovered from error"
}).catch(err => {
    console.error(`Error: ${err}`)
    return "recovered from error"
}).then(v => {
    console.info(`after catch: ${v}`)
})

console.info("after new promise")