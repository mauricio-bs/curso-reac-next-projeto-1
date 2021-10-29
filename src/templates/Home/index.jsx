import { useState, useEffect, useCallback } from 'react'
import { Button } from '../../components/Button'

import { Posts } from '../../components/Posts'
import { TextInput } from '../../components/TextInput'
import { loadPosts } from '../../utils/load-posts'

import './styles.css'

export const Home = () => {
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])

  const [page, setPage] = useState(0)
  const [postsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')

  const handleLoadPosts = useCallback(async (page, postsPerPage) => {
    const postsAndPhotos = await loadPosts()

    setPosts(postsAndPhotos.slice(page, postsPerPage))
    setAllPosts(postsAndPhotos)
  }, [])

  useEffect(() => {
    handleLoadPosts(0, postsPerPage)
  }, [handleLoadPosts, postsPerPage])

  async function loadMorePosts() {
    const nextPage = page + postsPerPage
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage)
    posts.push(...nextPosts)

    setPosts(posts)
    setPage(nextPage)
  }

  async function handleChange(e) {
    const { value } = e.target
    setSearchValue(value)
  }

  const filteredPosts = !!searchValue
    ? allPosts.filter((post) =>
        post.title.toUpperCase().includes(searchValue.toUpperCase())
      )
    : posts

  const noMorePosts = page + postsPerPage >= allPosts.length
  return (
    <section className='container'>
      <div className='search-container'>
        {!!searchValue && <h1>Search value: {searchValue}</h1>}
        <TextInput searchValue={searchValue} handleChange={handleChange} />
      </div>

      {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}

      {filteredPosts.length === 0 && <p>Não existem posts</p>}

      <div className='button-container'>
        {!searchValue && (
          <Button
            text='Load more posts'
            onClick={loadMorePosts}
            disabled={noMorePosts}
          />
        )}
      </div>
    </section>
  )
}
