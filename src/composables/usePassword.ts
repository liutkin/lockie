import { ref } from 'vue'
import generator from 'generate-password'

export default () => {
    const password = ref('')
    const passwordConfirmation = ref('')

    const generatePassword = () => {
        const randomPassword = generator.generate({
            length: 16,
            numbers: true,
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
