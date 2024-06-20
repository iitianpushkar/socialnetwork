
import parse from 'html-react-parser';
import moment from "moment";
import { HeartOutlined,CommentOutlined,HeartFilled } from '@ant-design/icons';
import { Avatar} from 'antd';
import Link from "next/link"
import imagesource from '../../function/index';
const PostList=({state,posts,handlelike,handleunlike,handlecomment})=>{
        return(
            <>
            {posts && posts.map((post)=><div className="card mb-3">
                   <div className="card-header">
                    <div>
                    <Avatar size={40} src={imagesource(post.postedBy)} />
                      <span className="pt-2 ml-3" style={{marginLeft:"1rem"}}>{post.postedBy.name}</span>
                        <span className="pt-2 ml-3" style={{marginLeft:"1rem"}}>{moment(post.createdAt).fromNow()}</span>
                        </div>
                   </div>
                   <div className="card-body">
                    <div>{parse(post.content)}</div>
                   </div>
                   <div className="card-footer">
                    {post.image && (
                        <div style={{
                            backgroundImage:"url("+ post.image.url + ")",
                            backgroundRepeat:"no-repeat",
                            backgroundPosition:"center center",
                            backgroundSize:"cover",
                            height:"800px"
                        }}>
                            </div>
                    )}
                    <div className="d-flex">
                        {state&&state.user&&post.like.includes(state.user._id)?(
                            <HeartFilled onClick={()=>{handleunlike(post._id)}} className='text-danger pt-2 h4' />
                                ):(<HeartOutlined onClick={()=>{handlelike(post._id)}} className='text-danger pt-2 h4' />)
                            }

                    <div className="pt-2 pl-3" style={{marginLeft:"1rem"}}>{post.like.length} likes</div>
                    <CommentOutlined onClick={()=>handlecomment(post)} className='text-danger pt-2 h4 pl-5' style={{marginLeft:"1rem"}} />
                    <div className="pt-2 pl-3" style={{marginLeft:"1rem"}}>
                        <Link className='text-decoration-none' href={`/post/${post._id}`}>{post.comment.length}comments</Link></div>
                    </div>
                   </div>
                 {  /* 2 comments show */}

                 {(post.comment && post.comment.length>0)? (
                    <ol className="list-group">
                       {post.comment.map((c)=>(
                         <li className="list-group-item d-flex justify-content-between align-items-start">
                         <div className="ms-2 me-auto">
                         <div>{c.text}</div>
                         <span className="badge rounded-pill text-muted">{moment(c.created).fromNow()}</span>
                         </div>
                     </li>
                       ))}
                    </ol>
                 ):(<></>)}
            </div>)}
            </>
        )
}

export default PostList;