const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {

        const tensor = tf.node
            .decodeJpeg(image)  
            .resizeNearestNeighbor([224, 224])  
            .expandDims()  
            .toFloat();  

        const prediction = model.predict(tensor);
        const score = await prediction.data();  
        const confidenceScore = Math.max(...score) * 100;  

        let result, suggestion;

        if (confidenceScore > 50) {  
            result = 'Cancer';
            suggestion = 'Segera periksa ke dokter!';
        } else {  
            result = 'Non-cancer';
            suggestion = 'Penyakit kanker tidak terdeteksi.';
        }

        return {
            confidenceScore,  
            result,           // Mengubah label menjadi result
            suggestion        
        };

    } catch (error) {
        console.error('Error during prediction:', error.message);
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi: ${error.message}`);
    }
}

module.exports = predictClassification;