const LoadingAnimation = () => {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    )
}

export default LoadingAnimation;