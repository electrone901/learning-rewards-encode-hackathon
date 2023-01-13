import {
  Button,
  VStack,
  Image,
  Box,
  Text,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { handleConnect } from '@utils/web3'
import { useState, useContext, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import withTransition from './withTransition'
import ConnectWallet from './web3/ConnectWallet'
import { MyAppContext } from '../pages/_app'
import { ethers } from 'ethers'
import { ABI } from '../abis/ABI'
import { disconnect } from 'process'

const getEthereumObject = () => window.ethereum

export function Landing() {
  const [isLoading, setLoading] = useState<boolean>(false)
  const {
    account,
    setAccount,
    contract,
    setContract,
    provider,
    setProvider,
    signer,
    setSigner,
    setBalance,
    setChainId,
  } = useContext(MyAppContext)
  console.log('____contract', contract)

  useEffect(() => {
    if (!account || !ethers.utils.isAddress(account)) return
    if (!window.ethereum) return

    // saves to localStorage
    if (typeof window !== 'undefined') {
      const fetchedAddress = window.localStorage.getItem('ACCOUNT')
      if (!account && fetchedAddress) setAccount(fetchedAddress)
      if (account && account !== fetchedAddress)
        window.localStorage.setItem('ACCOUNT', account)
    }
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    tempProvider.getBalance(account).then((result) => {
      setBalance(ethers.utils.formatEther(result))
    })
    tempProvider.getNetwork().then((result) => {
      setChainId(result.chainId)
    })
  }, [account])

  const handleConnect = async () => {
    if (!window.ethereum) {
      console.log('please install MetaMask')
      return
    }
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)
    const { chainId } = await tempProvider.getNetwork()
    console.log('chainId', chainId)
    const signer = tempProvider.getSigner()
    setSigner(signer)

    // create coontract based on network
    if (chainId == 5) {
      const deployedGoerlierContract =
        '0xC4ed0d9740AF37e5C2F068b2B10de10A714b6300'
      let contract = new ethers.Contract(deployedGoerlierContract, ABI, signer)
      setContract(contract)
    } else if (chainId == 80001) {
      const deployedMumbaiContract =
        '0x84260728E9A7fEA9Ab39f8Ca583Ed0afa2557bC0'
      let contract = new ethers.Contract(deployedMumbaiContract, ABI, signer)
      setContract(contract)
    } else {
      alert('Please connect to Goerli or Mumbai Test Network!')
    }

    tempProvider
      .send('eth_requestAccounts', [])
      .then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          window.localStorage.setItem('ACCOUNT', accounts[0])
        }
      })
      .catch((e) => console.log(e))
  }

  return (
    <div className={styles.container}>
      <main className={styles.landing}>
        <VStack gap={3} zIndex={1}>
          <VStack>
            <Box w={400}>
              <Image src="/logo2.png" alt="Learning rewards" />
            </Box>
            <Text className={styles.title}>
              Please connect your wallet to continue.
            </Text>
          </VStack>
          <Button onClick={handleConnect} className={styles.connectButton}>
            Connect with Metamask
          </Button>
          {/* <ConnectWallet /> */}
        </VStack>
        <Box className={styles.ellipseOne}></Box>
      </main>
    </div>
  )
}

export default withTransition(Landing)
