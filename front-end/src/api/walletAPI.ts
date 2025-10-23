
import axiosInstance from "./axios";


export default class WalletAPI {

    static async getWallets(userId: number) {
        const response = await axiosInstance.get(`wallets/${userId}`);
        if (response.status > 299 || response.status < 200) 
            throw new Error(`${response.status}: ${response.statusText}`);
        return response.data;
    }
}
