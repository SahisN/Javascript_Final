import axios from 'axios';

// disneyapi : https://disneyapi.dev/docs/
const base_url = 'https://api.disneyapi.dev';

export const keyword_search = async (keyword) => {
    
    try {
        const url = `${base_url}/character?name=${keyword}`;
        const getResponse = await axios.get(url);
        

        return getResponse.data;
       
    }
    catch (error) {
        console.error(error);
        
    }
}



export const details = async (id) => {
    try {
        const url = `${base_url}/character/${id}`;
        const getResponse = await axios.get(url);

        //console.log(getResponse.data)
        return getResponse.data;
    }

    catch (error) {
        console.error(error);
    }
}



