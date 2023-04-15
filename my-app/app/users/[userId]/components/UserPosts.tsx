type Props = {
    promise: Promise<Post[]>
}

export default async function UserPosts({ promise }: Props) {
    const posts = await promise

  return (
    <div>
        {posts.map(post => {
                return (
                    <article>
                        <h2>{post.id}</h2>
                        <p>{post.body}</p>
                        <br/>
                    </article>
                )})
        }
    </div>
  )
}
