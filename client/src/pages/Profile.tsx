import { useAuth, supabase } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Profile() {
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [isPwdUpdating, setIsPwdUpdating] = useState(false);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(session?.user?.user_metadata?.avatar_url || null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg('Error: New passcode and confirm passcode do not match.');
      return;
    }
    
    setIsPwdUpdating(true);
    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session?.user?.email || '',
      password: currentPassword
    });

    if (signInError) {
      setPwdMsg('Error: The current passcode entered is incorrect.');
      setIsPwdUpdating(false);
      return;
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
       setPwdMsg('Error: ' + error.message);
    } else {
       setPwdMsg('Password updated successfully');
       setCurrentPassword('');
       setNewPassword('');
       setConfirmPassword('');
       setShowCurrentPassword(false);
       setShowNewPassword(false);
       setShowConfirmPassword(false);
    }
    setIsPwdUpdating(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // show preview immediately
    const reader = new FileReader();
    reader.onload = (evt) => setAvatarPreview(evt.target?.result as string);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${session?.user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) throw updateError;
      
    } catch (error: any) {
      alert('Avatar Upload Error: ' + error.message + '\nNote: Ensure you have created a public "avatars" bucket in Supabase storage.');
      // Revert preview on failure
      setAvatarPreview(session?.user?.user_metadata?.avatar_url || null);
    } finally {
      setUploading(false);
    }
  };

  const emailName = session?.user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Profile Header Section */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 mt-8">
        <div className="relative group perspective-1000">
          <div className={`w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-primary/30 bg-surface-container-high flex items-center justify-center relative cursor-pointer transition-all duration-300 ${uploading ? 'animate-pulse border-secondary' : 'accent-glow'}`}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[80px] text-primary/50 group-hover:scale-110 transition-transform">person</span>
            )}
            
            <label className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white cursor-pointer group-hover:z-10">
               <span className="material-symbols-outlined text-3xl mb-1 group-hover:text-primary transition-colors">
                 {uploading ? 'cloud_upload' : 'add_a_photo'}
               </span>
               <span className="font-headline text-[10px] tracking-widest uppercase font-bold text-slate-300">
                 {uploading ? 'Uploading...' : 'Update Photo'}
               </span>
               <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleAvatarChange} />
            </label>
          </div>
          <div className="absolute -bottom-3 -right-3 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-black tracking-widest font-headline uppercase shadow-lg z-20">
            Active
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-[#c4c0ff] text-glow capitalize">
            {emailName}
          </h1>
          <p className="font-mono text-slate-500 text-sm tracking-widest uppercase">ID: {session?.user?.id.substring(0,8) || 'VX-9921-ALPHA'}</p>
        </div>
      </section>

      {/* Account Settings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        {/* User Details */}
        <div className="space-y-6">
          <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            User Details
          </h3>
          <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/10">
            <div className="p-6 border-b border-outline-variant/5">
              <p className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Email Address</p>
              <p className="text-white font-mono text-lg">{session?.user?.email}</p>
            </div>
            <div className="p-6 border-b border-outline-variant/5">
              <p className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">System Join Date</p>
              <p className="text-slate-300 font-mono text-sm">{new Date(session?.user?.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
            <div className="p-6">
              <p className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Account Role</p>
              <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-primary-container text-primary">Standard</span>
            </div>
          </div>
        </div>

        {/* Security / Password */}
        <div className="space-y-6">
          <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">security</span>
            Security Credentials
          </h3>
          <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/10 p-6">
            <p className="text-slate-400 font-body text-sm mb-6">Update your system access credentials.</p>
            
            {pwdMsg && (
                <div className={`mb-4 text-xs font-mono tracking-widest p-3 rounded-xl border uppercase ${pwdMsg.startsWith('Error') ? 'text-error bg-error/10 border-error/20' : 'text-secondary bg-secondary/10 border-secondary/20'}`}>
                    {pwdMsg}
                </div>
            )}
            
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
               <div className="group relative">
                 <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Current Passcode</label>
                 <input
                   type={showCurrentPassword ? 'text' : 'password'}
                   value={currentPassword}
                   onChange={e => setCurrentPassword(e.target.value)}
                   className="w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 px-3 py-3 pr-16 text-white font-mono focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder-slate-600 rounded-t-md"
                   placeholder="Enter current password"
                   required
                 />
                 {currentPassword && (
                   <button
                     type="button"
                     onClick={() => setCurrentPassword('')}
                     className="absolute right-10 top-[34px] text-slate-500 hover:text-white transition-colors"
                     title="Clear password"
                   >
                     <span className="material-symbols-outlined text-[20px]">close</span>
                   </button>
                 )}
                 <button
                   type="button"
                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                   className="absolute right-3 top-[34px] text-slate-500 hover:text-white transition-colors"
                 >
                   <span className="material-symbols-outlined text-[20px]">{showCurrentPassword ? 'visibility_off' : 'visibility'}</span>
                 </button>
               </div>
               <div className="group relative">
                 <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors">New Passcode</label>
                 <input
                   type={showNewPassword ? 'text' : 'password'}
                   value={newPassword}
                   onChange={e => setNewPassword(e.target.value)}
                   className="w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 px-3 py-3 pr-16 text-white font-mono focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder-slate-600 rounded-t-md"
                   placeholder="Enter new password"
                   required
                 />
                 {newPassword && (
                   <button
                     type="button"
                     onClick={() => setNewPassword('')}
                     className="absolute right-10 top-[34px] text-slate-500 hover:text-white transition-colors"
                     title="Clear password"
                   >
                     <span className="material-symbols-outlined text-[20px]">close</span>
                   </button>
                 )}
                 <button
                   type="button"
                   onClick={() => setShowNewPassword(!showNewPassword)}
                   className="absolute right-3 top-[34px] text-slate-500 hover:text-white transition-colors"
                 >
                   <span className="material-symbols-outlined text-[20px]">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                 </button>
               </div>
               <div className="group relative">
                 <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Confirm New Passcode</label>
                 <input
                   type={showConfirmPassword ? 'text' : 'password'}
                   value={confirmPassword}
                   onChange={e => setConfirmPassword(e.target.value)}
                   className="w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 px-3 py-3 pr-16 text-white font-mono focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder-slate-600 rounded-t-md"
                   placeholder="Re-enter new password"
                   required
                 />
                 {confirmPassword && (
                   <button
                     type="button"
                     onClick={() => setConfirmPassword('')}
                     className="absolute right-10 top-[34px] text-slate-500 hover:text-white transition-colors"
                     title="Clear password"
                   >
                     <span className="material-symbols-outlined text-[20px]">close</span>
                   </button>
                 )}
                 <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute right-3 top-[34px] text-slate-500 hover:text-white transition-colors"
                 >
                   <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                 </button>
               </div>
               <button
                 type="submit"
                 disabled={isPwdUpdating || !currentPassword || !newPassword || !confirmPassword}
                 className="w-full bg-surface-container-highest hover:bg-primary/20 text-primary border border-outline-variant/20 hover:border-primary/40 px-6 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 mt-6 flex gap-2 justify-center items-center"
               >
                 {isPwdUpdating ? <span className="material-symbols-outlined animate-spin text-sm">refresh</span> : null}
                 {isPwdUpdating ? 'Verifying...' : 'Confirm Update'}
               </button>
            </form>
          </div>
        </div>
      </section>

      {/* Logout / Danger Zone */}
      <div className="pt-12 pb-24 border-t border-outline-variant/10 mt-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
           <h4 className="text-error font-headline font-bold mb-1">Danger Zone</h4>
           <p className="text-sm text-slate-500">Revoke system access and securely log out.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-error font-headline font-bold opacity-80 hover:opacity-100 bg-error-container/20 hover:bg-error-container/40 px-6 py-3 rounded-xl border border-error/20 transition-all group">
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">logout</span>
          Terminate Current Session
        </button>
      </div>
    </div>
  );
}
