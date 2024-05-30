interface props{
    alt:string
    text1: string
    text2: string
    pt?: string
    size?: string
}

export default function Illustration({alt, text1, text2, pt='pt-20', size='w-56 h-52'}:props){
    return (
      <div className={`flex flex-col justify-center items-center ${pt} rounded-full`}>
        <img src='empty.png' alt={alt} className={`${size} rounded-full justify-self-center opacity-75`} />
        <p className="pt-6 pb-4 text-xl font-medium text-gray-300">{text1}</p>
        <p className="text-xl font-medium text-gray-300">{text2}</p>
      </div>
    )
  }