export type Record = {
    id: string
    login: string
    password: string
    title: string
    notes: string
    created: number
    deleted: number
    edited: number
    trash: boolean
    labels: string[]
}

export type Store = {
    created: number
    edited: number
    exported: number
    records: Record[]
}