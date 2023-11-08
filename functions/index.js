const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.syncArtworkToAllArtworks = functions.firestore
  .document('artists/{artistId}/artworkList/{artworkId}')
  .onCreate(async (snapshot, context) => {
    const artistId = context.params.artistId;
    const artworkData = snapshot.data();

    // You can now add artworkData to the 'allArtworks' collection
    const allArtworksRef = admin.firestore().collection('allArtworks');

    // Create a new document in 'allArtworks' with the artwork data
    const newArtworkDoc = allArtworksRef.doc();
    await newArtworkDoc.set(artworkData);

    console.log(`Artwork synced to 'allArtworks' with ID: ${newArtworkDoc.id}`);
    return null;
  });
