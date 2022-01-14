export function serialiseData(data: any) {
    
    if (data == null) return null;
    if (typeof data === "string") return data;

    const dataCopy = { ...data };
    if (dataCopy.offer && dataCopy.offer._manager) delete dataCopy.offer._manager; 
    return dataCopy;
}