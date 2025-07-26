interface ConfigI {
    db: {
        url: string;
    }
}

export const config: ConfigI ={
    db: {
        url: process.env.DB_URL || ""
    }
}