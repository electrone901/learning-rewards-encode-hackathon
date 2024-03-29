import { useState, useContext, useEffect } from 'react'
import { Text, SimpleGrid } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import withTransition from '@components/withTransition'
import { MyAppContext } from './_app'
import PartnerCard from '@components/PartnerCard'

import { ethers } from 'ethers'

function Explore() {
  const router = useRouter()

  const {
    account,
    contract,
    allTasks,
    setAllTasks,
    setAccount,
    setSelectedTask,
    selectedTask,
    provider,
  } = useContext(MyAppContext)
  console.log(' account, contract', account, contract)
  console.log('🚀____allTasks', allTasks)

  useEffect(() => {
    const getAllTasks = async (contract) => {
      const data = []
      const allTasks = await contract.getAllTasks()
      console.log('______All in useEffect ', allTasks)
      // setAllTasks(allTasks)

      for (let i = 0; i < allTasks.length; i++) {
        const obj = {}
        const IPFSCid = allTasks[i].IPFSCid
        const completed = allTasks[i].completed
        const id = allTasks[i].id
        const owner = allTasks[i].owner
        const price = allTasks[i].price.toString()

        const weiValue = allTasks[i].reward.toString()
        const reward = ethers.utils.formatEther(weiValue)

        let getNFTStorageData = await fetch(IPFSCid)

        let temp = await getNFTStorageData.json()
        const task = JSON.parse(temp.description)
        console.log('🚀 ~ file: tasks.js:49 ~ getAllTasks ~ task:', task)
        obj.completed = completed
        obj.id = id
        obj.owner = owner
        obj.price = price
        obj.reward = reward
        obj.description = task.description
        obj.experiencePoint = task.experiencePoint
        obj.image = task.image
        obj.level = task.level
        obj.questionsArray = task.questionsArray
        obj.rewardAmount = task.rewardAmount
        obj.subscriptionFee = task.subscriptionFee
        obj.title = task.title
        data.unshift(obj)
      }

      setAllTasks(data)
    }
    if (account && contract) {
      getAllTasks(contract)
    }
  }, [account, contract, setAllTasks])

  function handleClick(task) {
    console.log('1 task', task)
    setSelectedTask(task)
    router.push('/quest/V2zbf8iYGGGzFnkXQ6tB')
  }

  const test = async () => {
    console.log('____what_provider', provider)
    const to = 'elonmussk.eth'
    // const address1 = await provider.resolveName('elonmussk.eth')
    // console.log('🚀 ~ file: tasks.js:80 ~ test ~ address1', address1)
    const resolver = await provider.getResolver(to)
    console.log('🚀 ~ file: tasks.js:79 ~ test ~ resolver', resolver)
    const avatar = await resolver.getText('avatar')
    console.log('🚀 ~ file: tasks.js:80 ~ test ~ avatar', avatar)
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Text className={styles.title}>Explore Partners</Text>
        <SimpleGrid columns={2} gap={5} pt={10}>
          {allTasks?.length > 0 ? (
            allTasks.map((task, idx) => (
              <PartnerCard task={task} key={idx} handleClick={handleClick} />
            ))
          ) : (
            <h2>Loading....</h2>
          )}
        </SimpleGrid>
      </main>
    </div>
  )
}

export default withTransition(Explore)
