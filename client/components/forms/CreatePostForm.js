import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import styles
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, // Disable SSR for this component
});
import {CameraOutlined} from '@ant-design/icons'
import {Avatar} from "antd"

const CreatePostForm=({style,content,setContent,postsubmit,handleimage,image})=>{

    return(
        <div className="card mb-5">
            <div className="card-body pb-3">
                <form action="" className="form-group">
                    <ReactQuill value={content} onChange={e=>setContent(e)} className="form-control" placeholder="write something" />
                </form>
            </div>
            <div className="card-footer d-flex justify-content-between text-muted">
                <button onClick={postsubmit} className="btn btn-primary mt-1 btn-sm">Post</button>
                <label>
                    {
                      image && image.url ? (<Avatar size={30} src={image.url} /> ) : (<CameraOutlined/>)
            
                    }
                    <input onChange={handleimage} type="file" accept="images/*" hidden />
                </label>
            </div>
        </div>
    )
}

export default CreatePostForm;