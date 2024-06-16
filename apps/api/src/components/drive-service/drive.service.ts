const { google } = require('googleapis');

const credentials = require('./credentials.json');

const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

async function uploadFile(args: any) {
    try {
        const fileMetaData = {
            name: `${args.name}.txt`,
            parents: ['1D29xwOirXzBMOR7yRqmVYzvNzcsf5pYQ']
        }

        const mediaFile = {
            body: args.info,
            mimeType: 'text/plain'
        }
        const file = await drive.files.create({
            resource: fileMetaData,
            media: mediaFile,
            fields: 'id'
        })
        const fileId = file.data.id;
        return fileId
    } catch (error) {
    }
}
async function readFile(args: any) {
    const { data } = await drive.files.get({
        fileId: args.fileId,
        alt: 'media'
    });
    return data
}

async function updateFileContent(args: any) {
    const fileId = args.fileId as string
    const newContent = args.newContent as string
    // console.log("Nuevo contenido: ", newContent)
    try {
        const { data: existingFile } = await drive.files.get({
            fileId,
            fields: 'name, mimeType, size'
        });

        const fileMetadata = {
            name: existingFile.name,
            mimeType: existingFile.mimeType
        };

        const media = {
            mimeType: 'text/plain',
            body: newContent
        };

        const { data: updatedFile } = await drive.files.update({
            fileId,
            resource: fileMetadata,
            media: media,
            fields: 'id, name, mimeType, size'
        });

        console.log(`Archivo actualizado: ${updatedFile.name} (${updatedFile.size} bytes)`);
        return updatedFile;
    } catch (error) {
        console.error('Error al actualizar el archivo:', error);
        throw error;
    }
}


async function deleteFile(args: any) {
    try {
        await drive.files.delete({
            fileId: args.fileId
        });
        console.log(`Archivo borrado: ${args.fileId}`);
    } catch (error) {
        console.error('Error al borrar el archivo:', error);
        throw error;
    }
}

export const driveService = Object.freeze({
    uploadFile,
    readFile,
    updateFileContent,
    deleteFile,
});
