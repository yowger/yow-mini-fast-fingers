export function randomUsername(): string {
    const words = [
        "Yow",
        "Humba",
        "MangoFloat",
        "Macaroni",
        "Spaghetti",
        "RichKid",
        "Letchon",
        "BukoNiPico",
    ]
    const randomIndex = Math.floor(Math.random() * words.length)
    const chosenWord = words[randomIndex]
    const randomNumber = Math.floor(Math.random() * 100)
    return `${chosenWord}${randomNumber}`
}
