module.exports.escapeRegExp = (string) => {
    return string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}