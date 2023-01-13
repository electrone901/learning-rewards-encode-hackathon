import { NavLink } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react'
import GetAllStreams from '../components/broadcasts/GetAllStreams'
// import LivestreamContainer from './../components/broadcasts/LivestreamContainer'
// import UploadAsset from './../components/broadcasts/UploadAsset'
// import PastStreams from './../components/broadcasts/PastStreams'
// import CreateStream from './../components/broadcasts/CreateStream'
// import UploadLivestreamToAssets from './../components/broadcasts/UploadLivestreamToAssets'

// import './BroadCasts.scss'
function BroadCasts() {
  const [streams, setStreams] = useState([])
  const [fullscreen, setFullscreen] = useState(false)
  const [show, setShow] = useState(false)
  const [selectedStream, setSelectedStream] = useState('')
  const [showAssets, setShowAssets] = useState('')

  // create stream
  const [fullscreenNewStream, setFullscreenNewStream] = useState(false)
  const [showNewStreamComponent, setShowNewStreamComponent] = useState(false)

  const [showCreateAssetForm, setShowCreateAssetForm] = useState(false)

  const [assets, setAssets] = useState([])
  console.log('_______assets', assets)
  // const REACT_APP_API_KEY = 'e2852eb1-4bed-4c22-b27d-b174c83b1ee7'
  const REACT_APP_API_KEY = '389af0d8-c2a3-4587-b28c-8c33190d2898'

  const handleShow = (stream, showAssets) => {
    setSelectedStream(stream)
    setFullscreen(true)
    setShow(true)
    if (showAssets) {
      setShowAssets(true)
    }
  }
  const handleShowCreateStream = () => {
    console.log('LL')
    setFullscreenNewStream(true)
    setShowNewStreamComponent(true)
  }

  const postAsset = async (stream) => {
    const name = 'THIS IS A TEST!!!'
    const response = await fetch(
      `https://livepeer.studio/api/asset/request-upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      },
    )

    // Convert json response into JS object
    const data = await response.json()
    console.log('data', data)
    setAssets(data)
  }

  useEffect(() => {
    const getStreams = async () => {
      const res = await fetch(
        `https://livepeer.studio/api/stream?streamsonly=1`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await res.json()
      setStreams(data)
    }

    const getAssets = async () => {
      const res = await fetch(`https://livepeer.studio/api/asset`, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('🚀 ~ file: broadcasts.js:85 ~ getAssets ~ res', res)
      const data = await res.json()
      console.log('🚀 ~ file: broadcasts.js:94 ~ getAssets ~ data', data)
      setAssets(data)
    }
    getStreams()
    getAssets()
  }, [])

  return (
    <>
      <div className="mt-2 text-center">
        <Button
          variant="success"
          size="lg"
          className="p-2 m-4"
          onClick={handleShowCreateStream}
        >
          Create Stream
        </Button>
        <Button variant="secondary" size="lg" disabled>
          Total Streams: {streams ? streams?.length : 0}
        </Button>
      </div>

      {/* <CreateStream
        handleShowCreateStream={handleShowCreateStream}
        fullscreenNewStream={fullscreenNewStream}
        setFullscreenNewStream={setFullscreenNewStream}
        setShowNewStreamComponent={setShowNewStreamComponent}
        showNewStreamComponent={showNewStreamComponent}
      /> */}
      <h2 className="pt-5" style={{ color: 'white' }}>
        Upcoming Streams
      </h2>
      <GetAllStreams streams={streams} handleShow={handleShow} />
      <hr className="hr" style={{ color: 'white' }} />
      {/* <LivestreamContainer
        handleShow={handleShow}
        show={show}
        fullscreen={fullscreen}
        setShow={setShow}
        selectedStream={selectedStream}
        showAssets={showAssets}
      /> */}

      {/* Assest & Past Streams */}
      {/* <div className="mt-5 d-flex justify-content-between">
        <h2 style={{ color: 'white' }}>Assest & Past Streams</h2>
        <Button className="mb-4" size="lg" variant="secondary" disabled>
          Total Assets: {assets ? assets.length : 0}
        </Button>

        <Button
          className="mb-4"
          variant="success"
          size="lg"
          onClick={() => setShowCreateAssetForm(true)}
        >
          Create Asset
        </Button>
      </div>
      <UploadAsset
        assets={assets}
        handleShow={handleShow}
        showCreateAssetForm={showCreateAssetForm}
        setShowCreateAssetForm={setShowCreateAssetForm}
      /> */}
    </>
  )
}

export default BroadCasts
