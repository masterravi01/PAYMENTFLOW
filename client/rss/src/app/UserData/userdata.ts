export class UserData {
  setData(obj: any, key: string) {
    localStorage.setItem(key, btoa(JSON.stringify(obj)));
    return true;
  }

  getData(key: string): string | null | boolean {
    const data = localStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(atob(data));
    } else {
      return false;
    }
  }
  clearData(key: string) {
    localStorage.removeItem(key);
    return true;
  }
}
