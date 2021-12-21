const config = require( "./config" ) ;
const { create } = require( "ipfs-http-client" ) ;
const fs = require( "fs" ) ;

const pinataSDK = require( "@pinata/sdk" ) ;
const pinataApiKey = config.pinataApiKey ;
const pinataApiSecret = config.pinataApiSecret ;
const pinata = pinataSDK( pinataApiKey , pinataApiSecret ) ;


// client function to set the remote ipfs node
async function ipfsClient() {
  const ipfs = await create(
    {
      host: "ipfs.infura.io" ,
      port: 5001 ,
      protocol: "https"
    }
  ) ;

  return ipfs ;
}

// function to store the textual data to ipfs server
async function saveTextDataToIpfs() {
  let ipfs = await ipfsClient() ;

  let upload_details = await ipfs.add( "This text will be added to the ipfs" ) ;

  console.log( upload_details ) ;
}

// function to store file to ipfs server
async function saveFileToIpfs() {
  let ipfs = await ipfsClient() ;

  let filePath = fs.readFileSync( "./assets/vegeta.jpg" ) ;

  // let options = {
  //   progress: ( prog ) => console.log( "Save progress: " , prog )
  // } ;

  let upload_details = await ipfs.add( filePath ) ;

  console.log( upload_details ) ;
  console.log( "File successfully uploaded to IPFS server!" ) ;
  console.log( "IPFS URL: https://ipfs.io/ipfs/" + upload_details.path ) ;

  return upload_details.path ;
}

// pin file to ipfs using pinata sdk
async function pinFileToIPFS() {
  const options = {
    pinataMetadata: {
      name: "Vegeta" ,
      keyvalues: {
        mode: "SSJ Blue" ,
        race: "Saiyan"
      }
    }
  } ;

  let hash = await saveFileToIpfs() ;
  await pinata.pinByHash( hash , options )
    .then( ( result ) => {
      console.log( "File successfully pinned!" ) ;
      console.log( result ) ;
      console.log( "Pinata gateway URL: https://gateway.pinata.cloud/ipfs/" + result.ipfsHash ) ;
    } )
    .catch( ( err ) => {
      console.log( err ) ;
    } )
}

pinFileToIPFS() ;