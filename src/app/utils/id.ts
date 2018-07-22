let lastId = new Date().getTime();
export const getId = () => {
    lastId += 1;
    return lastId;
}