import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate} from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from './../axios/index'
import PrivateRoute from './PrivateRoute'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.clear()
    setMessage('Goodbye!')
    navigate('/')
    
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setSpinnerOn(true)
    console.log(spinnerOn)
    axios.post(loginUrl, { username, password })
        .then(res=>{
          localStorage.setItem('token',res.data.token)
          setMessage(res.data.message)
          navigate('/articles')
          

        })
        .catch(err=>{
          console.log(err)
        })
        .finally(()=>{
          setSpinnerOn(false)})
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(true)
    axiosWithAuth().get(articlesUrl)
                   .then(res=>{
                    //console.log(res.data)
                    
                    setArticles(res.data.articles)
                     const newMessages = res.data.message
                     setMessage(newMessages)
                   })
                   .catch(err=>{
                    console.log(err)
                    navigate('/')
                   })
                  .finally(() => {
                   setSpinnerOn(false)
                  })
  }

  
                   

  

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    axiosWithAuth().post(articlesUrl, article)
                   .then(res=>{
                    //console.log(res.data.article)
                     const newMessage = res.data.message
                     setArticles([...articles, res.data.article])
                    setMessage(newMessage)
                   })
                   .catch(err=>{
                    console.log(err)
                   })
                  .finally(() => {
                    setSpinnerOn(false)
                  })
  }

  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true)
    const itemId = `http://localhost:9000/api/articles/${article_id}`
    axiosWithAuth().put(itemId, article)
                   .then(res=>{
                     //console.log(res.data.article)
                     const updateMessage = res.data.message
                     const updateItem = res.data.article
                     const updateArray = articles.map(x=>{
                      if(x.article_id===article_id){
                        return updateItem 
                      }else{
                        return x
                      }
                     })
                     setArticles(updateArray)
                    setMessage(updateMessage)
                     setCurrentArticleId("")
                    
                   })
                   .catch(err=>{
                    console.log(err)
                   })
                  .finally(() => {
                    setSpinnerOn(false)
                  })
                   
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    const itemDeleteId = `http://localhost:9000/api/articles/${article_id}`
    axiosWithAuth().delete(itemDeleteId)
                   .then(res=>{
                    // console.log(res.data)
                    const deleteMessage=res.data.message
                     setArticles(articles.filter(x => x.article_id !== Number(article_id)))
                     setMessage(deleteMessage)
                   })
                    .catch(err => {
                      console.log(err)
                    })
                    .finally(() => {
                      setSpinnerOn(false)
                    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
    {/* on 存在的情况下 <Spinner /> */}
      <Spinner on={spinnerOn}/>  
    {/* message 存在的情况下 */}
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="/articles"
            element={(
              <PrivateRoute element={(
                <>
                  <ArticleForm
                    postArticle={postArticle}
                    currentArticleId={currentArticleId}
                  
                    updateArticle={updateArticle}
                    articles={articles}
                  />

                  <Articles
                    articles={articles}
                    getArticles={getArticles}
                    currentArticleId={Number(currentArticleId)}
                    setCurrentArticleId={setCurrentArticleId}
                    deleteArticle={deleteArticle}
                  />

                </>

              )} />
            )}
          />
        </Routes>
       

        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
