let lastId = new Date().getTime();
export const getUid = () => {
    lastId += 1;
    return lastId;
}