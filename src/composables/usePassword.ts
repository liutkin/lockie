import { ref } from 'vue'
import { sample, random } from "lodash-es"

const getRandomPassword = (minLength: number, maxLength: number, symbols: string): string =>
    [...Array(random(minLength, maxLength))]
        .map(() => sample(symbols))
        .join('')

export default () => {
    const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
    const password = ref('')
    const passwordConfirmation = ref('')

    const generatePassword = () => {
        const randomPassword = getRandomPassword(8, 16, symbols)
        password.value = randomPassword
        passwordConfirmation.value = randomPassword
    }

    return {
        password,
        passwordConfirmation,
        generatePassword,
    }
}
