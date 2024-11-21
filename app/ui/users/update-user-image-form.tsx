'use client'

// import { uploadUserImage } from '@/app/lib/actions'
import { User } from '@/app/lib/example/data'
import { ListBlobResultBlob } from '@vercel/blob'

interface Props {
  user: User
  blob: ListBlobResultBlob | null
}

export function UpdateUserImageForm({ blob }: Props) {
  // const uploadImage = async (formData: FormData) => {
  //   try {
  //     await uploadUserImage(user.id, formData)
  //   } catch (e) {
  //     console.error('Failed to upload image:', e)
  //     throw new Error('Failed to upload image.')
  //   }
  // }

  return (
    <>
      {/* <form action={uploadImage}> */}
      <form>
        <label htmlFor="image">Image</label>
        <input id="image" name="image" type="file" required />
        <button>Upload</button>
      </form>
      {blob && (
        <div>
          Latest Image url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  )
}
