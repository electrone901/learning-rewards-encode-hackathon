import React, { useState } from 'react'
import UploadLivestreamToAssets from './UploadLivestreamToAssets'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'

function CreateStream({
  showNewStreamComponent,
  setFullscreenNewStream,
  fullscreenNewStream,
  setShowNewStreamComponent,
}) {
  // const
  //   curl --location --request GET 'https://livepeer.studio/api/asset/$ASSET_ID' \
  // --header 'Authorization: Bearer $API_TOKEN'

  //  create stream page:
  // - streamName
  // - image: url
  // - APIKEY: fetch it from orbis broadcast channel
  // - chanelId: dusk is going to pass it using orbis
  // - streamerGroupId: dusk is going to pass it using orbis

  const [streamName, setStreamName] = useState('My first Streaming')
  const [image, setImage] = useState('')
  const [imageLink, setImageLink] = useState('')
  const [newStream, setNewStream] = useState('')
  console.log('________ imageLink', imageLink)

  const [chanelId, setChanelId] = useState('1')
  const [streamerGroupId, setStreamerGroupId] = useState('1')
  const [apiKeyOrbis, setApiKeyOrbis] = useState(process.env.REACT_APP_API_KEY)
  const [loading, setLoading] = useState(false)
  const profiles = [
    {
      name: '720p',
      bitrate: 2000000,
      fps: 30,
      width: 1280,
      height: 720,
    },
    {
      name: '480p',
      bitrate: 1000000,
      fps: 30,
      width: 854,
      height: 480,
    },
    {
      name: '360p',
      bitrate: 500000,
      fps: 30,
      width: 640,
      height: 360,
    },
  ]

  const handleImage = async (event) => {
    setImage(event.target.files[0])
    const updataData = new FormData()
    updataData.append('file', event.target.files[0])
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      updataData,
      {
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',

          pinata_api_key: 'c7edcfef00c948c3c82a',
          pinata_secret_api_key:
            'e666f9213127e62705a9429789443dff7b2069ed868ce095be04573fe3de0809',
        },
      },
    )
    setImageLink('https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash)
  }

  const createNewStream = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`https://livepeer.studio/api/stream`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: streamName,
          profiles,
          // chanelId,
          // imageLink: imageLink,
          // streamerGroupId: streamerGroupId,
        }),
      })
      const data = await response.json()
      setStreamName('')
      console.log('CREATED_____________data', data)
      // id:"3c8f261e-90c9-401e-9465-fda7a680b6ea"
      // record: false

      // after creating display the newstream with
      // would you like to Enable Recording on your streamming?
      // Enable Recording allow your livestream to be save and automatic upload as an asset at the end of the stream.
      // router.push('/livestream/getStreams')
      //  now i need to update  Upcoming Streams
      setNewStream(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Modal
        show={showNewStreamComponent}
        fullscreen={fullscreenNewStream}
        onHide={() => setShowNewStreamComponent(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title> Create Stream</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {newStream?.id ? (
            <UploadLivestreamToAssets newStreamId={newStream?.id} />
          ) : (
            <div className=" container pt-5 d-flex align-items-center justify-content-center">
              <div className="card  p-5" style={{ width: '55%' }}>
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="stream"
                    style={{ width: '350px', paddingBottom: '1rem' }}
                  />
                ) : (
                  ''
                )}
                <form
                  action=""
                  className="text-start"
                  onSubmit={createNewStream}
                >
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Image
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      defaultValue={image}
                      placeholder="Image URL"
                      onChange={handleImage}
                      // required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="company" className="form-label">
                      Stream Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      placeholder="My Favorite game"
                      defaultValue={streamName}
                      onChange={(e) => setStreamName(e.target.value)}
                      required
                    />
                  </div>

                  {/* <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Chanel Id
              </label>
              <input
                type="text"
                className="form-control"
                id="chanelId"
                placeholder="chanelId"
                defaultValue={chanelId}
                onChange={(e) => setChanelId(e.target.value)}
              />
            </div> */}

                  {/* <div className="mb-3">
              <label htmlFor="website" className="form-label">
                Streamer Group Id
              </label>
              <input
                type="text"
                className="form-control"
                id="website"
                placeholder="Phillyps Mer"
                defaultValue={streamerGroupId}
                onChange={(e) => setStreamerGroupId(e.target.value)}
              />
            </div> */}

                  {/* loading icons */}
                  <div className="mb-3">
                    {loading ? (
                      <div>
                        <h3>Posting your asset...</h3>
                        <div
                          className="spinner-grow text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>

                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>

    // <div>
    //   <h1 style={{ color: 'white' }}>CreateStream</h1>

    //   {newStream?.id ? (
    //     <UploadLivestreamToAssets newStreamId={newStream?.id} />
    //   ) : (
    //     <div className="content-form">
    //       <div className="card" style={{ width: '55%' }}>
    //         {image ? (
    //           <img
    //             src={URL.createObjectURL(image)}
    //             alt="stream"
    //             style={{ width: '350px', paddingBottom: '1rem' }}
    //           />
    //         ) : (
    //           ''
    //         )}
    //         <form action="" className="form-inline" onSubmit={createNewStream}>
    //           <div className="mb-3">
    //             <label htmlFor="formFile" className="form-label">
    //               Image
    //             </label>
    //             <input
    //               className="form-control"
    //               type="file"
    //               id="formFile"
    //               defaultValue={image}
    //               placeholder="Image URL"
    //               onChange={handleImage}
    //               // required
    //             />
    //           </div>

    //           <div className="mb-3">
    //             <label htmlFor="company" className="form-label">
    //               Stream Name
    //             </label>
    //             <input
    //               type="text"
    //               className="form-control"
    //               id="company"
    //               placeholder="My Favorite game"
    //               defaultValue={streamName}
    //               onChange={(e) => setStreamName(e.target.value)}
    //               required
    //             />
    //           </div>

    //           {/* <div className="mb-3">
    //           <label htmlFor="address" className="form-label">
    //             Chanel Id
    //           </label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             id="chanelId"
    //             placeholder="chanelId"
    //             defaultValue={chanelId}
    //             onChange={(e) => setChanelId(e.target.value)}
    //           />
    //         </div> */}

    //           {/* <div className="mb-3">
    //           <label htmlFor="website" className="form-label">
    //             Streamer Group Id
    //           </label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             id="website"
    //             placeholder="Phillyps Mer"
    //             defaultValue={streamerGroupId}
    //             onChange={(e) => setStreamerGroupId(e.target.value)}
    //           />
    //         </div> */}

    //           {/* loading icons */}
    //           <div className="mb-3">
    //             {loading ? (
    //               <div>
    //                 <h3>Posting your asset...</h3>
    //                 <div className="spinner-grow text-primary" role="status">
    //                   <span className="visually-hidden">Loading...</span>
    //                 </div>
    //               </div>
    //             ) : (
    //               ''
    //             )}
    //           </div>

    //           <button type="submit" className="btn btn-success">
    //             Submit
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   )}
    // </div>
  )
}

export default CreateStream
