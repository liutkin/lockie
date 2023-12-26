import { ref } from 'vue'
import { randomString } from 'secure-random-password'

export const usePassword = () => {
    const password = ref(null)
    const passwordConfirmation = ref(null)

    const generatePassword = () => {
        const randomPassword = randomString({
            length: 16,
        })
        password.value = randomPassword
        passwordConfirmation.value = randomPassword
    }

    return {
        password,
        passwordConfirmation,
        generatePassword,
    }
}
