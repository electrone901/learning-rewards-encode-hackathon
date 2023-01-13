import React, { useState } from 'react'
import GetAllStreams from './GetAllStreams'
import axios from 'axios'
import * as tus from 'tus-js-client'

function UploadAsset({
  assets,
  handleShow,
  showCreateAssetForm,
  setShowCreateAssetForm,
}) {
  // custome variable to pass as props
  const streams = assets

  const [video, setVideo] = useState('')
  const [streamName, setStreamName] = useState('This is the greatest')
  const [loading, setLoading] = useState(false)

  // Set the state name and file provided by the user
  const [assetName, setAssetName] = useState('MY assets')
  console.log('MY___assetName', assetName)
  const [file, setFile] = useState('')
  // Set the state of the ulpoad URL create
  const [assetURL, setAssetURL] = useState('')
  const [assetTUS, setAssetTUS] = useState('')
  // Set state of the uploading progress
  const [directProgress, setDirectProgress] = useState(0)
  const [resumeProgress, setResumeProgress] = useState(0)
  const [uploadMethod, setUploadMethod] = useState()

  //  get it from orbis
  const [chanelId, setChanelId] = useState('1')
  const [streamerGroupId, setStreamerGroupId] = useState('1')

  const handleVideo = async (event) => {
    setVideo(event.target.files[0])
  }

  async function getUploadURL(e) {
    e.preventDefault()
    try {
      // Calling the api from backend with the path created in api directory
      const response = await fetch(
        `https://livepeer.studio/api/asset/request-upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: assetName,
          }),
        },
      )

      // Convert json response into JS object
      const data = await response.json()

      setAssetURL(data.url)
      setAssetTUS(data.tusEndpoint)
    } catch (e) {
      console.log(e)
    }
  }

  // Function for uploading with direct url
  async function uploadDirectAsset(e) {
    e.preventDefault()
    const config = {
      // Axios' onUploadProgress function to keep track of the file upload progress
      onUploadProgress(progressEvent) {
        console.log(progressEvent)
        const percentage = Math.round(
          100 * (progressEvent.loaded / progressEvent.total),
        )
        setDirectProgress(percentage)
      },
    }
    try {
      // Using axios to access their 'onUploadProgress' function
      await axios.put(`${assetURL}`, file, config, {
        headers: {
          'Content-Type': 'video/mp4',
        },
        body: file,
      })

      setAssetName('')
      setFile('')
      setAssetURL('')
      setShowCreateAssetForm(false)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  // Function with resumeable uploading
  async function uploadResumableAsset(e) {
    e.preventDefault()
    try {
      // Using tus-js-client for resumable uploading
      const upload = new tus.Upload(file, {
        endpoint: assetTUS, // Using 'tusEndpoint' from generated url
        metadata: {
          filename: streamName,
          filetype: 'video/mp4',
        },
        uploadSize: file.size,
        onError(err) {
          console.error('Error uploading file:', err)
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          setResumeProgress(percentage)
        },
        onSuccess() {
          setShowCreateAssetForm(false)
          window.location.reload()
        },
      })

      const previousUploads = await upload.findPreviousUploads()
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }
      upload.start()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const filename = 'filename'

    setLoading(true)
    try {
      const response = await axios(
        `https://livepeer.studio/api/asset/request-upload`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: streamName,
            video,
          }),
        },
      )

      // const data = await response.json()
      // setStreamName('')
      // console.log('CREATED_____________data', data)
      // id:"3c8f261e-90c9-401e-9465-fda7a680b6ea"
      // record: false

      // after creating display the newstream with
      // would you like to Enable Recording on your streamming?
      // Enable Recording allow your livestream to be save and automatic upload as an asset at the end of the stream.
      // router.push('/livestream/getStreams')
      //  now i need to update  Upcoming Streams
      // setNewStream(data)
    } catch (error) {
      console.log(error)
    }

    //     curl --location --request POST 'https://livepeer.studio/api/asset/request-upload' \
    // --header 'Authorization: Bearer $API_TOKEN' \
    // --header 'Content-Type: application/json' \
    // --data-raw '{
    //     "name":"Example name"
    // }'

    //     curl --location --request PUT "${url}" \
    // --header 'Content-Type: video/mp4' \
    // --data-binary '@$VIDEO_FILE_PATH'

    const upload = new tus.Upload(video, {
      // endpoint: 'https://livepeer.studio/api/asset/request-upload', // URL from `tusEndpoint` field in the `/request-upload` response
      endpoint: 'https://livepeer.studio/api/asset/import', // URL from `tusEndpoint` field in the `/request-upload` response
      metadata: {
        filename,
        filetype: 'video/mp4',
      },
      uploadSize: video.size,
      onError(err) {
        console.error('Error uploading file:', err)
      },
      onProgress(bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
      },
      onSuccess() {
        console.log('Upload finished:', upload.url)
      },
    })
    const previousUploads = await upload.findPreviousUploads()
    if (previousUploads.length > 0) {
      upload.resumeFromPreviousUpload(previousUploads[0])
    }
    upload.start()
  }

  return (
    <div>
      {/* Show  */}
      {showCreateAssetForm ? (
        <div className=" container mt-5 d-flex align-items-center justify-content-center">
          {assetURL || assetTUS ? (
            <form
              onSubmit={
                uploadMethod === assetURL
                  ? uploadDirectAsset
                  : uploadResumableAsset
              }
              method="PUT"
              className="card p-5"
              style={{ width: '75%' }}
            >
              <h5 className="h5">Select Upload Method</h5>
              <select
                className="border rounded-md text-base mx-2"
                onChange={(e) => setUploadMethod(e.target.value)}
              >
                <option disabled selected value>
                  Select an option
                </option>
                <option value={assetURL}>Direct Upload</option>
                <option value={assetTUS}>Resumable Upload</option>
              </select>
              <br />
              <input
                type="file"
                name="assetFile"
                accept="video/mp4"
                required
                onChange={(e) => setFile(e.target.files[0])}
              />

              <label htmlFor="progress" className=" mt-5 mb-3">
                {uploadMethod === assetURL ? directProgress : resumeProgress}%
              </label>
              <div className="progressContainer">
                <progress
                  max="100"
                  style={{ width: '75%' }}
                  value={
                    uploadMethod === assetURL ? directProgress : resumeProgress
                  }
                >
                  {uploadMethod}
                </progress>
              </div>
              <button type="submit" className="btn btn-success mt-5 mb-5">
                Upload Asset
              </button>
            </form>
          ) : (
            <div className="card  p-5">
              <div className="mb-3">
                <label htmlFor="company" className="form-label">
                  Asset Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="company"
                  placeholder="My asset #1"
                  defaultValue={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>
              <button onClick={getUploadURL} className="btn btn-success">
                Get Upload URL
              </button>
            </div>
          )}
        </div>
      ) : (
        ''
      )}
      <br />
      <br />
      <br />
      <GetAllStreams
        streams={streams}
        showAssets={true}
        handleShow={handleShow}
      />
      {/*       <br />
      <br />
      <br />
      <br />

      <div className="content-form">
        <div className="card" style={{ width: '55%' }}>
          <form action="" className="form-inline" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                File to upload
              </label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                defaultValue=""
                onChange={handleVideo}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="company" className="form-label">
                Asset Name
              </label>
              <input
                type="text"
                className="form-control"
                id="company"
                placeholder="My asset #1"
                defaultValue={streamName}
                onChange={(e) => setStreamName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              {loading ? (
                <div>
                  <h3>Posting your asset...</h3>
                  <div className="spinner-grow text-primary" role="status">
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
       */}
    </div>
  )
}

export default UploadAsset
