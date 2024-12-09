import { SMTPServer } from "smtp-server";

export const createSMTPServer = () => {
    try {
        const SMTP_PORT = 2525;
        const server = new SMTPServer({
            authOptional: true,
            onData(stream, session, callback) {
                stream.pipe(process.stdout);
                stream.on("end", callback);
            },
        });

        server.listen(SMTP_PORT, () => {
            console.log(`Servidor SMTP escuchando en el puerto ${SMTP_PORT}`);
          });
    } catch (error) {
        console.error(error);
    }
}