import { getUserInfo } from '@/api/user_request.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {
    const result = await getUserInfo();
    console.debug(result)
    if (result.code === 200) {
        return {
            userinfo: result.data
        }
    }
    console.error(result.message)
    throw error(result.code, result.message)
}