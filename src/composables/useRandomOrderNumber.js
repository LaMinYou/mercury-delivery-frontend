export const useRandomOrderNumber = () => {
    const timeStamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNum = `ORD-${timeStamp}-${randomNum}`;

    return orderNum;
}